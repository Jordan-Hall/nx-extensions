import { NormalizedSchema } from '../schema';
import { ProjectType } from '@nrwl/workspace';
import {
  addProjectConfiguration,
  joinPathFragments,
  NxJsonProjectConfiguration,
  TargetConfiguration,
  Tree,
} from '@nrwl/devkit';

export function addProject(tree: Tree, options: NormalizedSchema) {
  const targets: { [key: string]: TargetConfiguration } = {
    build: createBuildTarget(options),
    serve: createServeTarget(options),
    lint: createLintTarget(options),
  };

  if (options.unitTestRunner === 'jest') {
    targets.test = createTestTarget(options);
  } else {
    tree.delete(joinPathFragments(options.projectRoot, 'jest.config.js'));
    tree.delete(joinPathFragments(options.projectRoot, 'tsconfig.spec.json'));
  }

  const nxConfig: NxJsonProjectConfiguration = {
    tags: options.parsedTags,
  };

  addProjectConfiguration(tree, options.name, {
    root: options.projectRoot,
    sourceRoot: `${options.projectRoot}/src`,
    projectType: ProjectType.Application,
    ...nxConfig,
    targets,
  });
}

function createBuildTarget(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: '@nxext/svelte:build',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath: joinPathFragments('dist', options.projectRoot),
      entryFile: joinPathFragments(options.projectRoot, 'src', 'main.ts'),
      tsConfig: joinPathFragments(options.projectRoot, 'tsconfig.app.json'),
      assets: [{ glob: '/*', input: joinPathFragments(options.projectRoot, 'public/**'), output: './' }],
    },
    configurations: {
      production: {
        dev: false,
      },
    },
  };
}

function createServeTarget(options: NormalizedSchema): TargetConfiguration {
  let serverOptions: {
    // Ignore
  };
  if (options.port !== 5000) {
    serverOptions = { port: options.port };
  }
  if (options.host !== 'localhost') {
    serverOptions = {
      ...serverOptions,
      ...{ host: options.host },
    };
  }

  return {
    executor: '@nxext/svelte:build',
    options: {
      ...{
        outputPath: joinPathFragments('dist', options.projectRoot),
        entryFile: joinPathFragments(options.projectRoot, 'src', 'main.ts'),
        tsConfig: joinPathFragments(options.projectRoot, 'tsconfig.app.json'),
        assets: [{ glob: '/*', input: joinPathFragments(options.projectRoot, 'public/**'), output: './' }],
        watch: true,
        serve: true,
      },
      ...serverOptions,
    },
  };
}

function createLintTarget(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: '@nrwl/linter:lint',
    options: {
      linter: 'eslint',
      tsConfig: joinPathFragments(options.projectRoot, 'tsconfig.app.json'),
      exclude: [
        '**/node_modules/**',
        `!${joinPathFragments(options.projectRoot, '**/*')}`,
      ],
    },
  };
}

function createTestTarget(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: '@nrwl/jest:jest',
    options: {
      jestConfig: joinPathFragments(options.projectRoot, 'jest.config.js'),
      passWithNoTests: true,
    },
  };
}
