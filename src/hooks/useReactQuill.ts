import { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import ResizeImage from 'quill-resize-image'

Quill.register('modules/resizeImage', ResizeImage)

const BlockEmbed = Quill.import('blots/block/embed')

class CustomVideo extends BlockEmbed {
  static create(value: string) {
    const node = super.create(value)
    node.setAttribute('src', value)
    node.setAttribute('frameborder', '0')
    node.setAttribute('allowfullscreen', true)
    return node
  }

  static value(node: HTMLElement) {
    return node.getAttribute('src')
  }
}

CustomVideo.blotName = 'customVideo'
CustomVideo.tagName = 'iframe'
CustomVideo.className = 'ql-video'

Quill.register(CustomVideo)

const useReactQuill = () => {
  const modules = {
    toolbar: {
      container: [
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
    },
    resizeImage: {
      image: {
        displaySize: true,
        modules: ['Resize', 'DisplaySize', 'Toolbar'],
      },
      video: {
        resize: false,
      },
    },
    resizeVideo: false,
  }

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
    'customVideo',
  ]

  return {
    modules,
    formats,
  }
}

export default useReactQuill
