/**
 * Copyright (c) [2018]-present, Walmart Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License."
 */

"use strict";

const { toSchema } = require("./to-schema");
const { stringifySchema } = require("./stringify-schema");

const safeFnExecute = fn => {
  try {
    return { value: fn() };
  } catch (error) {
    return { error };
  }
};

const validateJson = jsonInput => {
  const { error: jsonError, value } = safeFnExecute(() => JSON.parse(jsonInput));

  if (jsonError) {
    jsonError.message = `Invalid JSON received: ${jsonInput}, error: ${jsonError.message}`;
    return { error: jsonError };
  }

  if (!value) {
    return { error: new Error(`Invalid JSON received: ${jsonInput}`) };
  }

  return { value };
};

const jsonToSchema = ({ baseType = "AutogeneratedMainType", jsonInput }) => {
  const { error, value } = validateJson(jsonInput);
  if (error) {
    return { error };
  }

  return safeFnExecute(() => stringifySchema(baseType, toSchema(value)));
};

module.exports = {
  jsonToSchema,
  validateJson
};