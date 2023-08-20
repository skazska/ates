import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import employeeCudSchema from '../../../../lib/types/employee/cud.v1.Schema.json';
import taskCudSchema from '../../../../lib/types/task/cud.v1.Schema.json';
import taskChangedSchema from '../../../../lib/types/task/changed.v1.Schema.json';

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: false,
});
addFormats(ajv);

export const employeeCudValidator = ajv.compile(employeeCudSchema);
export const taskCudValidator = ajv.compile(taskCudSchema);
export const taskChangedValidator = ajv.compile(taskChangedSchema);
