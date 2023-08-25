import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import cudSchema from '../../../../lib/types/task/cud.v1.Schema.json';
import cudSchemaV2 from '../../../../lib/types/task/cud.v2.Schema.json';
import changedSchema from '../../../../lib/types/task/changed.v1.Schema.json';
import employeeCudSchema from '../../../../lib/types/employee/cud.v1.Schema.json';

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: false,
});
addFormats(ajv);

export const employeeCudValidator = ajv.compile(employeeCudSchema);
export const cudValidator = ajv.compile(cudSchema);
export const cudValidatorV2 = ajv.compile(cudSchemaV2);
export const changedValidator = ajv.compile(changedSchema);
