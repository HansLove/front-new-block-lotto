// refactor-imports.ts
import path from 'path';
import { Project } from 'ts-morph';

// Execute with npx tsx ./scripts/refactor-imports.ts

const project = new Project({
  tsConfigFilePath: 'tsconfig.json',
});

// Get all source files
const sourceFiles = project.getSourceFiles();

console.log(`Processing ${sourceFiles.length} files...`);

let transformedCount = 0;

sourceFiles.forEach(sourceFile => {
  const filePath = sourceFile.getFilePath();
  let hasChanges = false;

  sourceFile.getImportDeclarations().forEach(importDecl => {
    const moduleSpecifier = importDecl.getModuleSpecifierValue();

    // Only transform relative imports that go up directories
    if (moduleSpecifier.startsWith('../')) {
      const currentDir = path.dirname(filePath);
      const targetPath = path.resolve(currentDir, moduleSpecifier);
      const srcDir = path.resolve(process.cwd(), 'src');

      // Get relative path from src directory
      const relativePath = path.relative(srcDir, targetPath);

      // Transform to alias
      const newModuleSpecifier = `@/${relativePath.replace(/\\/g, '/')}`;

      console.log(`${path.basename(filePath)}: ${moduleSpecifier} → ${newModuleSpecifier}`);

      importDecl.setModuleSpecifier(newModuleSpecifier);
      hasChanges = true;
    }
  });

  if (hasChanges) {
    sourceFile.saveSync();
    transformedCount++;
  }
});

console.log(`✅ Transformed ${transformedCount} files`);
console.log('🎉 Refactor completed!');
