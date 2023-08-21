import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import employeeCudSchema from '../../../../lib/types/employee/cud.v1.Schema.json';
import taskCudSchema from '../../../../lib/types/task/cud.v2.Schema.json';
import taskChangedSchema from '../../../../lib/types/task/changed.v1.Schema.json';
import paidSchema from '../../../../lib/types/accounting/paid.v1.Schema.json';
import balanceChangedSchema from '../../../../lib/types/accounting/balance-changed.v1.Schema.json';
import dayFixedSchema from '../../../../lib/types/accounting/day-fixed.v1.Schema.json';
import priceSetSchema from '../../../../lib/types/accounting/price-set.v1.Schema.json';

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: false,
});
addFormats(ajv);

export const employeeCudValidator = ajv.compile(employeeCudSchema);
export const taskCudValidator = ajv.compile(taskCudSchema);
export const taskChangedValidator = ajv.compile(taskChangedSchema);

export const paidValidator = ajv.compile(paidSchema);
export const balanceChangedValidator = ajv.compile(balanceChangedSchema);
export const dayFixedValidator = ajv.compile(dayFixedSchema);
export const priceSetValidator = ajv.compile(priceSetSchema);
