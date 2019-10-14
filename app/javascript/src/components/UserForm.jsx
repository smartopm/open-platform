import React from 'react';
import {Field} from 'formik';

export default function UserForm(props){
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    errors,
    touched,
  } = props;
  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="bmd-label-static" htmlFor="firstName">Name</label>
          <input className="form-control" type="text" onChange={handleChange} onBlur={handleBlur} value={values.name} name="name"/>
          {errors.name && touched.name ? (
            <div>{errors.name}</div>
          ) : null}
        </div>
        <div className="form-group">
          <label className="bmd-label-static" htmlFor="firstName">Email</label>
          <input className="form-control" type="text" onChange={handleChange} onBlur={handleBlur} value={values.email} name="email"/>
          {errors.email && touched.email ? (
            <div>{errors.email}</div>
          ) : null}
        </div>
        <div className="form-group">
          <label className="bmd-label-static" htmlFor="firstName">Phone Number</label>
          <input className="form-control" type="text" onChange={handleChange} onBlur={handleBlur} value={values.phoneNumber} name="phoneNumber"/>
          {errors.phoneNumber && touched.phoneNumber ? (
            <div>{errors.phoneNumber}</div>
          ) : null}
        </div>
        <div className="form-group">
          <label className="bmd-label-static" htmlFor="firstName">User Type</label>
          <Field component="select" name="userType" className="form-control">
            <option></option>
            <option value="admin">Admin</option>
            <option value="security_guard">Security Guard</option>
            <option value="resident">Resident</option>
            <option value="contractor">Contractor</option>
          </Field>
          {errors.userType && touched.userType ? (
            <div>{errors.userType}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label className="bmd-label-static" htmlFor="firstName">State</label>
          <Field component="select" name="state" className="form-control">
            <option value="pending">Pending</option>
            <option value="valid">Valid</option>
            <option value="banned">Banned</option>
          </Field>
          {errors.state && touched.state ? (
            <div>{errors.state}</div>
          ) : null}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
