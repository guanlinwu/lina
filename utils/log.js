/**
 * 定义输出的颜色
 */

/**
 * 警告
 * console.error(warning(`Checking for updates failed${suffix}`));
 */
export const warning = message => chalk`{yellow WARNING:} ${message}`
/**
 * 提示
 */
export const info = message => chalk`{magenta INFO:} ${message}`
/**
 * 出错
 */
export const error = message => chalk`{red ERROR:} ${message}`
