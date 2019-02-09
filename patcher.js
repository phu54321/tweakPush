const ar = require('ar')
const fs = require('fs')
const tarcdmp = require('./tardcmp')
const ldid = require('./ldid')
const JSZip = require('jszip')
const process = require('process')

const patchBinary = require('./patchBinary')

if (process.argv.length <= 2) {
  console.log(`Usage: ${process.argv[0]} ${process.argv[1]} [.deb file]`)
  process.exit(-1)
}

const ifname = process.argv[2]
if (!ifname.endsWith('.deb')) {
  console.log('Not a deb file')
  process.exit(-1)
}

const ofname = ifname.substr(0, ifname.length - 4) + '.patched.zip'

ldid().then(async runtime => {
  const debContent = fs.readFileSync(ifname)
  const debAr = new ar.Archive(debContent)

  const files = debAr.getFiles()
  files.forEach(f => {
    console.log(f.name(), f.fileSize())
  })
  const dataF = files
    .find(f => f.name().startsWith('data.tar'))
  const dataFiles = tarcdmp(dataF.name(), dataF.fileData())

  // dylib patch
  const payloadFiles = []
  const executableFiles = []
  const dylibPatchedFiles = dataFiles.map(f => {
    let { name, fileData, mode: permissions } = f
    if (name.startsWith('./')) name = name.substr(2)
    if (name.endsWith('.deb')) return // ignore deb file (maybe metafile?)
    if (name.startsWith('Library/')) name = 'var/LIB/' + name.substr(8)
    if (name.startsWith('Applications/')) {
      console.log(' - Apps with /Applications/ content not supported')
      throw new Error('Unsupported .deb')
    }

    // fix for some offending things
    console.log(name, fileData.length)

    const buf = Buffer.from(fileData.slice(0, 8))
    if (buf.readUInt32BE(0) === 0xcafebabe) {
      console.log(` - applying ldid & ldid2`)
      fileData = patchBinary(runtime, fileData)
      executableFiles.push(name)
    }

    payloadFiles.push(name)
    return { name, fileData, permissions }
  }).filter(x => x)

  let paylodDirectories = []
  payloadFiles.forEach(name => {
    let lastSlash
    while ((lastSlash = name.lastIndexOf('/')) !== -1) {
      name = name.substr(0, lastSlash)
      paylodDirectories.push(name)
    }
  })
  paylodDirectories = [...new Set(paylodDirectories)]
  paylodDirectories.sort()

  const zip = new JSZip()
  dylibPatchedFiles.forEach(({ name, fileData, permissions }) => {
    zip.file('Payload/' + name, fileData, {
      unixPermissions: permissions
    })
  })

  // Create .sh
  let installerSh = '#!/var/containers/Bundle/iosbinpack64/bin/sh\n'
  installerSh += paylodDirectories.map(name => `mkdir -p "/${name}"\n`).join('')
  installerSh += payloadFiles.map(name =>
    `cp "Payload/${name}" "/${name}"\n` +
    `chown mobile "/${name}"\n`
  ).join('')
  installerSh += executableFiles.map(name => `inject "/${name}"\n`).join('')
  zip.file('install', installerSh, {
    unixPermissions: '755'
  })

  let uninstallerSh = '#!/var/containers/Bundle/iosbinpack64/bin/sh\n'
  uninstallerSh += payloadFiles.map(name => `rm -f "/${name}"\n`).join('')

  zip.file('uninstall', uninstallerSh, {
    unixPermissions: '755'
  })

  zip.file('respring', '#!/var/containers/Bundle/iosbinpack64/bin/sh\nkillall SpringBoard\n', {
    unixPermissions: '755'
  })

  zip
    .generateNodeStream({
      platform: 'UNIX',
      type: 'nodebuffer',
      compression: 'deflate',
      streamFiles: true
    })
    .pipe(fs.createWriteStream(ofname))
    .on('finish', function () {
      console.log('done! Quitting after 3sec')
      setTimeout(() => { }, 3000)
    })
})
