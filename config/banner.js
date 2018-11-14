const pkg = require('../package.json');
export const banner = `/**
 * ${pkg.name} v${pkg.version}
 * Copyright 2018-${new Date().getFullYear()} ${pkg.author}
 * Released under the MIT License
 * ${pkg.repository.url}
 **/
`;