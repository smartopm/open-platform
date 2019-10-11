import React from 'react';

export default function RequestForm(props){
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
          <label className="bmd-label-static" htmlFor="firstName">First Name</label>
          <input className="form-control" type="text" onChange={handleChange} onBlur={handleBlur} value={values.firstName} name="firstName"/>
          {errors.firstName && touched.firstName ? (
            <div>{errors.firstName}</div>
          ) : null}
        </div>
        <div className="form-group">
          <label className="bmd-label-static" htmlFor="lastName">Last Name</label>
          <input className="form-control" type="text" onChange={handleChange} onBlur={handleBlur} value={values.lastName} name="lastName"/>
          {errors.lastName && touched.lastName ? (
            <div>{errors.lastName}</div>
          ) : null}
        </div>
        <div className="form-group">
          <label className="bmd-label-static" htmlFor="Reason">Reason</label>
          <input className="form-control" type="text" onChange={handleChange} onBlur={handleBlur} value={values.requestReason} name="requestReason"/>
          {errors.requestReason && touched.requestReason ? (
            <div>{errors.requestReason}</div>
          ) : null}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
