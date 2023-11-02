import Joi from "joi";
import JJoi from "./jjoi.js";
import JJoiLegacy from "./jjoi-legacy.js";
import jSchemaToJoiSchema from "./jschema-to-joi-schema.js";
import type { Schema } from "joi";

export default JJoiLegacy;
export { JJoi,JJoiLegacy,Joi,jSchemaToJoiSchema };
export type { Schema };
