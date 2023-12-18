/*
 * This file contains the new suggested way to register ts-node w/ esm support. Apparently the old "loader" option is
 * now deprecated.
 *
 * See here:
 * https://nodejs.org/dist/latest-v20.x/docs/api/module.html#customization-hooks
 *
 * I sort of understand it, but not enough to explain it. _But_ this works okay in this project. Here's hoping v22 will
 * do a better job explaining how to piece this all together.
 */

import { register } from "node:module";

register("ts-node/esm", import.meta.url);
