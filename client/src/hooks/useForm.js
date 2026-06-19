import { useState } from 'react';

export function useForm(initial, validators = {}) {
  const [values, setValues]   = useState(initial);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    const next = type === 'checkbox' ? checked : value;
    const updated = { ...values, [name]: next };
    setValues(updated);
    setErrors((errs) => {
      if (!errs[name]) return errs;
      const fn = validators[name];
      return { ...errs, [name]: fn ? fn(next, updated) : '' };
    });
  };

  const onBlur = (e) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    const fn = validators[name];
    if (fn) setErrors((errs) => ({ ...errs, [name]: fn(value, values) }));
  };

  const validate = () => {
    const errs = {};
    Object.keys(validators).forEach((k) => {
      errs[k] = validators[k](values[k] ?? '', values);
    });
    setErrors(errs);
    setTouched(
      Object.keys(validators).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    );
    return Object.values(errs).every((e) => !e);
  };

  const reset = () => {
    setValues(initial);
    setErrors({});
    setTouched({});
  };

  return { values, errors, touched, onChange, onBlur, validate, reset };
}
