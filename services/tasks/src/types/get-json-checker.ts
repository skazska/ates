import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import cudSchema from '../../../../lib/types/task/cud.v1.Schema.json';
import changedSchema from '../../../../lib/types/task/changed.v1.Schema.json';

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: false,
});
addFormats(ajv);

export const cudValidator = ajv.compile(cudSchema);
export const changedValidator = ajv.compile(changedSchema);
