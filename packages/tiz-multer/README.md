# tiz-multer
> multipart tool for tiz


## Install

```sh
$ npm i tiz-multer -S
```

## Usage

### per route middleware as multer do

```js
const multer = require('tiz-multer')
const upload = multer({
  dest: '/data/uploads'
})

router.get('/upload', upload.single('image'), async ctx => {
  // blabla
})
```

### as plugin add `ctx.upload` method

```js
router.get('/upload', async ctx => {
  try {
    await ctx.uploadSingle('image', {
      /* multer options */
      dest: '/uploads/dir'
    })
  } catch (e) {

  }
})
```