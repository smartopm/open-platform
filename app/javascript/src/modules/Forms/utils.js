/* eslint-disable no-eval */
/* eslint-disable security/detect-eval-with-expression */
import dompurify from 'dompurify';
import { objectAccessor, titleCase, truncateString } from '../../utils/helpers';

/**
 *
 * @param {{}} values
 * @param {String} propId
 * @returns {Boolean}
 * @description checks if a form property exist
 */
export function propExists(values, propId) {
  return values.some(value => value.form_property_id === propId);
}

/**
 *
 * @param {object} properties
 * @param {string} propId
 * @description check form values that weren't filled in and add default values
 */
export function addPropWithValue(properties, propId) {
  if (propExists(properties, propId)) {
    return;
  }
  properties.push({ value: null, form_property_id: propId });
}

/**
 *
 * @param {[object]} categories
 * @returns {[object]} a flat array containing a list of all form properties for the given categories
 */
export function flattenFormProperties(categories) {
  if (!categories) return [];
  const properties = categories.map(category => category.formProperties);
  return properties.flat();
}

/**
 * We always want to show a category when it has no display condition
 * We can only display a category when its groupingId in displayCondition matches the value in the matching property
 * Otherwise we just dont display a category
 * @param {object} category
 * @param {[object]} properties
 * @param {boolean} editMode
 * @returns {boolean}
 */
export function checkCondition(category, properties, editMode) {
  if (editMode) {
    return true;
  }
  if (!category.displayCondition?.groupingId) {
    return true;
  }
  const property = properties.find(
    prop => prop.form_property_id === category.displayCondition.groupingId
  );
  const value = typeof property?.value === 'object' ? property?.value?.checked : property?.value;
  const processedValue = value?.trim().toLowerCase();
  const processedConditionValue = category?.displayCondition?.value.trim().toLowerCase();
  if (
    property &&
    eval(
      dompurify.sanitize(
        `"${processedValue}" ${category.displayCondition.condition} "${processedConditionValue}"`
      )
    )
  ) {
    return true;
  }
  return false;
}

/**
 * check if a given item has a value or a form_property_id
 * This is used to check fields that values before submitting a form
 * @param {object} item
 * @returns {boolean}
 */
export function nonNullValues(item) {
  return item.value && item.value?.checked !== null && item.form_property_id !== null;
}

/**
 *
 * @param {object} formProperties
 * @param {String} type This is the type of action we are trying, whether just extracting or submitting
 * @description removes the field name from a property so focus on groupingId and value
 * @returns {[object]}
 */
export function extractValidFormPropertyValue(formProperties, type = 'extract') {
  if (!Object.keys(formProperties).length) return [];
  return Object.entries(formProperties)
    .map(([, prop]) => {
      if (prop.type === 'checkbox') {
        return {
          value: type === 'extract' ? Object.keys(prop.value).join(', ') : prop.value,
          form_property_id: prop.form_property_id
        };
      }
      return prop;
    })
    .filter(nonNullValues);
}
/**
 * This focuses on field names which extractValidFormPropertyValue lacks,
 * we could've done both under one function but when submitting a form GraphQL test complain because of unmatching args
 * @param {object} formProperties
 * @returns [{object}]
 */
export function extractValidFormPropertyFieldNames(formProperties) {
  if (!Object.keys(formProperties).length) return [];
  return Object.entries(formProperties)
    .map(([key, prop]) => {
      if (prop.type === 'checkbox') {
        return {
          value: Object.entries(prop.value)
            .map(([k, val]) => (val ? k : null))
            .filter(Boolean)
            .join(', '),
          fieldName: key
        };
      }
      return { fieldName: key, value: prop.value?.checked || prop.value };
    })
    .filter(nonNullValues);
}

/**
 * gets a markdown text and a list of formproperties with their values and finds variables that matches
 * the fieldname and replaces its actual value from the about to be submitted form property.
 * @param {string} renderedText
 * @param {[object]} data
 * @returns {string}
 */
export function parseRenderedText(categories, data) {
  if (!categories) return '';
  const properties = extractValidFormPropertyFieldNames(data);
  const renderedText = extractRenderedTextFromCategory(data, categories);
  const words = renderedText.split(' ');
  return words
    .map(word => {
      const wordToReplace = word.split('_').join(' ');
      const formProperty = properties.find(prop => {
        return (
          prop.fieldName?.toLowerCase().trim() ===
          wordToReplace
            .replace(/\n|#/gi, '')
            .replace(/[,.]/, '')
            .toLowerCase()
        );
      });
      if (formProperty) {
        return word.replace(/#(\w+)/i, formProperty.value);
      }
      return word;
    })
    .join(' ');
}

/**
 * Ensure we only show contract preview for currently enabled categories in this form
 * @param {[object]} formProperties
 * @param {[object]} categoriesData
 * @returns {string}
 */
export function extractRenderedTextFromCategory(formProperties, categoriesData) {
  if (!categoriesData) return '';
  const properties = extractValidFormPropertyValue(formProperties);
  const validCategories = categoriesData.filter(category =>
    checkCondition(category, properties, false)
  );
  const text = validCategories.map(category => `${category.renderedText}  `).join('');
  return text;
}

/**
 * Validates required fields
 * @param {[object]} filledInProperties
 * @param {[object]} formData
 * @returns {Boolean}
 */
export function requiredFieldIsEmpty(filledInProperties, formData) {
  let result = false;
  const valid = formData.filter(category => checkCondition(category, filledInProperties, false));

  // TODO: This could use some optimization
  // eslint-disable-next-line no-restricted-syntax
  for (const category of valid) {
    // eslint-disable-next-line no-restricted-syntax
    for (const form of category.formProperties) {
      if (
        form.required &&
        !filledInProperties.find(filled => form.id === filled.form_property_id)?.value
      ) {
        result = true;
        break;
      }
    }
  }
  return result;
}

/**
 * Validates individual required field
 * @param {object} property
 * @param {[object]} formData
 * @returns {Boolean}
 */
export function checkRequiredFormPropertyIsFilled(property, formData) {
  if (
    property &&
    Array.isArray(formData?.categories) &&
    formData?.categories.length > 0 &&
    Array.isArray(formData?.filledInProperties) &&
    formData?.filledInProperties.length > 0
  ) {
    const activeCategories = formData?.categories?.filter(category =>
      checkCondition(category, formData?.filledInProperties, false)
    );
    const propertyBelongsToActiveCategory = activeCategories.some(category =>
      category.formProperties.some(prop => prop.id === property.id)
    );

    // Validate properties from active categories only
    if (propertyBelongsToActiveCategory) {
      if (formData.error && property.required) {
        if (property.fieldType === 'checkbox') {
          const fieldValues = formData?.filledInProperties.find(
            filledProp => property.id === filledProp.form_property_id
          )?.value;
          return !fieldValues || Object.values(fieldValues).some(val => !val);
        }

        if (['date', 'time', 'datetime'].includes(property.fieldType)) {
          const fieldValue = formData?.filledInProperties.find(
            filledProp => property.id === filledProp.form_property_id
          )?.value;
          return !fieldValue || Number.isNaN(Date.parse(fieldValue));
        }

        return !formData?.filledInProperties.find(
          filledProp => property.id === filledProp.form_property_id
        )?.value;
      }
    }
  }

  return false;
}

/**
 * Generate an iframe snippet that can be embedded elsewhere
 * @param {{id: String, name: String}} form
 * @param {String} hostname
 * @returns
 */
export function generateIframeSnippet(form, hostname) {
  const url = `https://${hostname}/form/${form.id}/public`;
  return `<iframe src=${url} name=${form.name} title=${form.name} scrolling="auto" width="100%" height="500px" />`;
}

/**
 *
 * @param {Number} bytes
 * @returns the converted size of the file to upload
 *
 */
export function convertUploadSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) {
    return 'N/A';
  }
  const convertedBytes = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  const size = objectAccessor(sizes, convertedBytes);
  if (convertedBytes === 0) {
    return `${bytes} ${size}`;
  }
  return `${(bytes / 1024 ** convertedBytes).toFixed(0)} ${size}`;
}

/**
 * Remove extension from files and truncate them to save some space on mobile
 * @param {String} name
 * @returns {String}
 */
export function cleanFileName(name) {
  if (!name) return '';
  const filename = name.split('.')[0];
  return titleCase(truncateString(filename, 18));
}

/**
 * Return translated versions of the known file types
 * @param {Function} t
 * @returns
 */
export function fileTypes(t) {
  return {
    'image/jpeg': t('common:file_types.image'),
    'image/jpg': t('common:file_types.image'),
    'image/png': t('common:file_types.image'),
    'image/gif': t('common:file_types.image'),
    'image/x-dwg': t('common:file_types.autocad'),
    'image/x-dwf': t('common:file_types.autocad'),
    'image/x-dxf': t('common:file_types.autocad'),
    'image/svg+xml': t('common:file_types.image'),
    wav: t('common:file_types.audio'),
    'audio/mpeg': t('common:file_types.audio'),
    'video/mp4': t('common:file_types.video'),
    'video/mpeg': t('common:file_types.video'),
    'application/pdf': t('common:file_types.pdf'),
    'application/zip': t('common:file_types.compressed_file'),
    'application/x-7z-compressed': t('common:file_types.compressed_file'),
    'application/x-zip-compressed': t('common:file_types.compressed_file')
  };
}

/**
 *
 * @param {[object]} uploads
 * @param {{name: String}} file
 * @param {String} propertyId
 * @returns
 */
export function isUploaded(uploads, file, propertyId) {
  if (!uploads || !file || !propertyId) {
    return false;
  }
  return uploads.some(upload => upload.filename === file.name && upload.propertyId === propertyId);
}

export function isFileNameSelect(filenames, file, propertyId) {
  if (!filenames || !file || !propertyId) {
    return false;
  }
  return filenames.some(filename => filename.name === file && filename.propertyId === propertyId);
}

export async function handleFileSelect(event, propertyObj, t) {
  const checkSelectFile = await Object.values(event.target.files).some(file =>
    isFileNameSelect(propertyObj.filesToUpload, file.name, propertyObj.propertyId)
  );

  if (checkSelectFile) {
    propertyObj.setMessageAlert(t('form:errors.file_exists'));
    propertyObj.setIsSuccessAlert(false);
    return;
  }
  const newFiles = await Object.values(event.target.files).map(file =>
    Object.assign(file, {
      propertyId: propertyObj.propertyId,
      fileNameId: `${file.name}${propertyObj.propertyId}`
    })
  );
  await propertyObj.setFilesToUpload([...propertyObj.filesToUpload, ...newFiles]);
}

export function handleFileUpload(file, propertyObj, t) {
  const fileType = ['pdf'];
  const validType =
  fileType.includes(file.type.split('/')[1]) || file.type.split('/')[0] === 'image';
  if (!validType) {
    propertyObj.setMessageAlert(t('form:errors.wrong_file_type'));
    propertyObj.setIsSuccessAlert(false);
    return;
  }
  propertyObj.setFormState({
    ...propertyObj.formState,
    currentPropId: propertyObj.propertyId,
    isUploading: true,
    currentFileNames: [...propertyObj.formState.currentFileNames, `${file.name}${file.propertyId}`]
  });
  propertyObj.startUpload(file);
}

export function onNotUploadedImageRemove(file, propertyObj) {
  const filteredImages = propertyObj.filesToUpload.filter(
    item => item.fileNameId !== file.fileNameId
  );
  propertyObj.setFilesToUpload(filteredImages);
}

export async function onImageRemove(imagePropertyId, file, propertyObj) {
  const filteredImages = propertyObj.uploadedImages.filter(im => im.propertyId !== imagePropertyId);
  const filtCurrentUploadedImg = propertyObj.uploadedImages.filter(
    im => im.propertyId === imagePropertyId && im.filename !== file.name
  );
  await propertyObj.setUploadedImages([...filteredImages, ...filtCurrentUploadedImg]);
  const filterFileName = propertyObj.formState.currentFileNames.filter(
    im => im !== `${file.name}${file.propertyId}`
  );
  await propertyObj.setFormState({ ...propertyObj.formState, currentFileNames: filterFileName });
  onNotUploadedImageRemove(file, propertyObj);
}

export function removeBeforeUpload(file, isFileUploaded, formPropertyId, propertyObj) {
  if (isFileUploaded) {
    return onImageRemove(formPropertyId, file, propertyObj);
  }
  return onNotUploadedImageRemove(file, propertyObj);
}
