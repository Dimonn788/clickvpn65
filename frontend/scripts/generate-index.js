import fs from 'fs'
import path from 'path'

const distClient = path.resolve(process.cwd(), 'dist', 'client')
const assetsDir = path.join(distClient, 'assets')

function findAsset(regex) {
  if (!fs.existsSync(assetsDir)) return null
  const files = fs.readdirSync(assetsDir)
  return files.find((f) => regex.test(f)) || null
}

function findLargestJs() {
  if (!fs.existsSync(assetsDir)) return null
  const files = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.js'))
  if (files.length === 0) return null
  let largest = files[0]
  let largestSize = 0
  for (const f of files) {
    const stat = fs.statSync(path.join(assetsDir, f))
    if (stat.size > largestSize) {
      largest = f
      largestSize = stat.size
    }
  }
  return largest
}

async function main() {
  try {
    if (!fs.existsSync(distClient)) {
      console.error('dist/client not found - build may have failed')
      process.exit(0)
    }

    const css = findAsset(/^styles-.*\.css$/) || findAsset(/\.css$/)
    const indexJs = findAsset(/^index-.*\.js$/) || findLargestJs()

    if (!indexJs) {
      console.error('No JS asset found in dist/client/assets; skipping index.html generation')
      process.exit(0)
    }

    const cssLink = css ? `/assets/${css}` : null
    const jsSrc = `/assets/${indexJs}`

    const html = `<!doctype html>
  <html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Lovable</title>
    <base href="/" />
    ${cssLink ? `<link rel="stylesheet" href="${cssLink}" />` : ''}
  </head>
  <body>
    <div id="root"></div>
    <noscript>JavaScript is required to run this app.</noscript>
    <script type="module" src="${jsSrc}"></script>
  </body>
  </html>`

    fs.writeFileSync(path.join(distClient, 'index.html'), html, 'utf8')
    console.log('Wrote dist/client/index.html')

    // Also copy built client files to the backend static directory so the
    // FastAPI server can serve the SPA from the same domain.
    const backendStatic = path.resolve(process.cwd(), '..', 'backend', 'static')
    try {
      if (!fs.existsSync(backendStatic)) {
        console.warn('Backend static dir not found, skipping copy to backend static directory')
      } else {
        // Copy assets into the backend static root (FastAPI mounts /assets -> STATIC_DIR)
        const files = fs.readdirSync(assetsDir)
        for (const f of files) {
          fs.copyFileSync(path.join(assetsDir, f), path.join(backendStatic, f))
        }

        // Copy index.html to backend static (overwrite any debug/index file)
        fs.copyFileSync(path.join(distClient, 'index.html'), path.join(backendStatic, 'index.html'))
        console.log('Copied built client files to backend static directory')
      }
    } catch (err) {
      console.warn('Failed to copy files to backend static dir:', err)
    }
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
