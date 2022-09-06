import fs from 'node:fs'
import path from 'node:path'
import logger from '../logger'

function readFiles(dirPath: string, files: string[] = []) {
    const currentFiles = fs.readdirSync(dirPath)

    currentFiles.forEach(file => {
        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
            files = readFiles(dirPath + '/' + file, files)
        } else if ((file.endsWith('.ts') || file.endsWith('.js')) && !file.startsWith('.')) {
            files.push(path.join(dirPath, file))
            logger.info(`Found file ${file}`)
        }
    })

    return files
}

export { readFiles }