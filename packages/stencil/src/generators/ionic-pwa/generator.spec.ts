import { STYLE_PLUGIN_DEPENDENCIES } from '../../utils/typings';
import { fileListForAppType } from '../../utils/testing';
import { SupportedStyles } from '../../stencil-core-utils';
import { readJson, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { ionicPwaGenerator } from './generator';
import { applicationGenerator } from '../application/generator';
import { RawPWASchema } from './schema';
import { Linter } from '@nrwl/linter';

describe('schematic:ionic-pwa', () => {
  let host: Tree;
  const options: RawPWASchema = {
    name: 'test',
    style: SupportedStyles.css,
    linter: Linter.None,
  };

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace();
  });

  it('should add tags to nx.json', async () => {
    await ionicPwaGenerator(host, { ...options, tags: 'e2etag,e2ePackage' });
    const projectConfig = readProjectConfiguration(host, options.name);
    expect(projectConfig.tags).toEqual(['e2etag', 'e2ePackage']);
  });

  it('should create files', async () => {
    await ionicPwaGenerator(host, { ...options, linter: Linter.EsLint });

    const fileList = fileListForAppType(
      options.name,
      SupportedStyles.css,
      'application'
    );
    fileList.forEach((file) => expect(host.exists(file)));

    const eslintJson = readJson(host, 'apps/test/.eslintrc.json');
    expect(eslintJson.extends).toEqual([
      'plugin:@stencil/recommended',
      'plugin:import/recommended',
      'plugin:import/typescript',
      '../../.eslintrc.json',
    ]);
  });

  it('should create files in specified dir', async () => {
    await ionicPwaGenerator(host, { ...options, directory: 'subdir' });

    const fileList = fileListForAppType(
      options.name,
      SupportedStyles.css,
      'application',
      'subdir'
    );
    fileList.forEach((file) => expect(host.exists(file)));
  });

  it('should add Stencil/Ionic PWA dependencies', async () => {
    await ionicPwaGenerator(host, options);
    const packageJson = readJson(host, 'package.json');
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeDefined();
  });

  Object.keys(SupportedStyles).forEach((style) => {
    it(`should add Stencil ${style} dependencies to pwa`, async () => {
      await ionicPwaGenerator(host, {
        ...options,
        style: SupportedStyles[style],
      });
      const packageJson = readJson(host, 'package.json');
      expect(packageJson.devDependencies['@stencil/core']).toBeDefined();

      const styleDependencies = STYLE_PLUGIN_DEPENDENCIES[style];
      for (const devDependenciesKey in styleDependencies.devDependencies) {
        expect(packageJson.devDependencies[devDependenciesKey]).toBeDefined();
      }
    });
  });

  Object.keys(SupportedStyles).forEach((style) => {
    it(`should add component config for ${style} to workspace config`, async () => {
      await ionicPwaGenerator(host, {
        name: options.name,
        style: SupportedStyles[style],
      });

      const projectConfig = readProjectConfiguration(host, options.name);
      expect(projectConfig.generators).toEqual({
        '@nxext/stencil:component': {
          style: style,
        },
      });
    });
  });

  it(`shouldn't create spec files if unitTestrunner is 'none'`, async () => {
    await applicationGenerator(host, { ...options, unitTestRunner: 'none' });

    expect(
      host.exists(`apps/test/src/components/app-home/app-home.spec.ts`)
    ).toBeFalsy();
    expect(
      host.exists(`apps/test/src/components/app-root/app-root.spec.ts`)
    ).toBeFalsy();
    expect(
      host.exists(`apps/test/src/components/app-profile/app-profile.spec.ts`)
    ).toBeFalsy();
  });
});
