<template>
  <div class="my-2">
    <div
      v-if="showLabel"
      class="mb-2"
    >
      <span>
        <strong> {{ label }} </strong>
        <span
          v-if="required && label"
          style="color: red"
          >*</span
        >
      </span>
    </div>
    <div ref="editorContainer"></div>
    <p
      v-if="!required && !inputVal"
      transition="scroll-y-transition"
      class="ck-editor-error"
    >
      Content is Required
    </p>
  </div>
</template>

<script>
  import {
    ClassicEditor,
    Alignment,
    Autoformat,
    AutoLink,
    Autosave,
    BlockQuote,
    Bold,
    Underline,
    Essentials,
    FindAndReplace,
    Heading,
    HorizontalLine,
    Indent,
    IndentBlock,
    Italic,
    Link,
    Paragraph,
    SelectAll,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    Undo,
    List,
    FontBackgroundColor,
    FontColor,
    FontSize,
    FontFamily,
    Highlight,
    SpecialCharacters,
    Strikethrough,
    TodoList,
  } from 'ckeditor5';

  import 'ckeditor5/ckeditor5.css';

  export default {
    name: 'CustomCkEditor',
    props: {
      modelValue: {
        type: String,
        default: '',
      },
      isCkeditorChanged: {
        type: Boolean,
        default: false,
      },
      id: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        default: '',
      },
      required: {
        type: Boolean,
        default: false,
      },
      showLabel: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        editorInstance: null,
      };
    },
    computed: {
      inputVal: {
        get() {
          return this.modelValue;
        },
        set(val) {
          this.$emit('update:modelValue', val);
        },
      },
    },
    watch: {
      modelValue() {
        if (this.isCkeditorChanged) {
          this.destroyCkEditor();
          this.createCkEditor();
        }
      },
    },
    beforeUnmount() {
      this.destroyCkEditor();
    },
    methods: {
      destroyCkEditor() {
        const editorElement =
          document.getElementsByClassName('ck-editor');
        if (editorElement) {
          editorElement[0].innerHTML = '';
        }
      },
      createCkEditor() {
        const editorConfig = {
          toolbar: {
            items: [
              'heading',
              '|',
              'bold',
              'italic',
              'underline',
              'link',
              '|',
              'numberedList',
              'bulletedList',
              'outdent',
              'indent',
              'alignment',
              '|',
              'fontBackgroundColor',
              'fontColor',
              'fontSize',
              'fontFamily',
              'blockQuote',
              'insertTable',
              'horizontalLine',
              'highlight',
              'specialCharacters',
              'strikethrough',
              'findAndReplace',
              'todoList',
              'selectAll',
              'undo',
              'redo',
            ],
            shouldNotGroupWhenFull: false,
          },
          plugins: [
            Alignment,
            Autoformat,
            AutoLink,
            Autosave,
            BlockQuote,
            Bold,
            Underline,
            Essentials,
            FindAndReplace,
            Heading,
            HorizontalLine,
            Indent,
            IndentBlock,
            Italic,
            Link,
            Paragraph,
            SelectAll,
            Table,
            TableCaption,
            TableCellProperties,
            TableColumnResize,
            TableProperties,
            TableToolbar,
            TextTransformation,
            Undo,
            List,
            FontBackgroundColor,
            FontColor,
            FontSize,
            FontFamily,
            Highlight,
            SpecialCharacters,
            Strikethrough,
            TodoList,
          ],
          heading: {
            options: [
              {
                model: 'paragraph',
                title: 'Paragraph',
                class: 'ck-heading_paragraph',
              },
              {
                model: 'heading1',
                view: 'h1',
                title: 'Heading 1',
                class: 'ck-heading_heading1',
              },
              {
                model: 'heading2',
                view: 'h2',
                title: 'Heading 2',
                class: 'ck-heading_heading2',
              },
              {
                model: 'heading3',
                view: 'h3',
                title: 'Heading 3',
                class: 'ck-heading_heading3',
              },
              {
                model: 'heading4',
                view: 'h4',
                title: 'Heading 4',
                class: 'ck-heading_heading4',
              },
              {
                model: 'heading5',
                view: 'h5',
                title: 'Heading 5',
                class: 'ck-heading_heading5',
              },
              {
                model: 'heading6',
                view: 'h6',
                title: 'Heading 6',
                class: 'ck-heading_heading6',
              },
            ],
          },
          link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            decorators: {
              toggleDownloadable: {
                mode: 'manual',
                label: 'Downloadable',
                attributes: {
                  download: 'file',
                },
              },
            },
          },
          placeholder: 'Type or paste your content here!',
          table: {
            contentToolbar: [
              'tableColumn',
              'tableRow',
              'mergeTableCells',
              'tableProperties',
              'tableCellProperties',
            ],
          },
        };
        ClassicEditor.create(this.$refs.editorContainer, editorConfig)
          .then((editor) => {
            this.editorInstance = editor;
            editor.setData(this.inputVal);

            editor.model.document.on('change:data', () => {
              this.inputVal = editor.getData();
            });
          })
          .catch((error) => {
            console.error(error);
          });
      },
    },
    async mounted() {
      this.createCkEditor();
    },
  };
</script>
<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Oswald&family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap');

  .ck-editor-error {
    color: red;
    margin-top: 5px;
    position: absolute;
  }

  .ck-content {
    font-family: 'Lato';
    line-height: 1.6;
    word-break: break-word;
  }

  .editor-container_classic-editor .editor-container__editor {
    min-width: 795px;
    max-width: 795px;
  }

  .ck-content h3.category {
    font-family: 'Oswald';
    font-size: 20px;
    font-weight: bold;
    color: #555;
    letter-spacing: 10px;
    margin: 0;
    padding: 0;
  }

  .ck-content h2.document-title {
    font-family: 'Oswald';
    font-size: 50px;
    font-weight: bold;
    margin: 0;
    padding: 0;
    border: 0;
  }

  .ck-content h3.document-subtitle {
    font-family: 'Oswald';
    font-size: 20px;
    color: #555;
    margin: 0 0 1em;
    font-weight: bold;
    padding: 0;
  }

  .ck-content p.info-box {
    --background-size: 30px;
    --background-color: #e91e63;
    padding: 1.2em 2em;
    border: 1px solid var(--background-color);
    background: linear-gradient(
        135deg,
        var(--background-color) 0%,
        var(--background-color) var(--background-size),
        transparent var(--background-size)
      ),
      linear-gradient(
        135deg,
        transparent calc(100% - var(--background-size)),
        var(--background-color) calc(100% - var(--background-size)),
        var(--background-color)
      );
    border-radius: 10px;
    margin: 1.5em 2em;
    box-shadow: 5px 5px 0 #ffe6ef;
  }

  .ck-content blockquote.side-quote {
    font-family: 'Oswald';
    font-style: normal;
    float: right;
    width: 35%;
    position: relative;
    border: 0;
    overflow: visible;
    z-index: 1;
    margin-left: 1em;
  }

  .ck-content blockquote.side-quote::before {
    content: '“';
    position: absolute;
    top: -37px;
    left: -10px;
    display: block;
    font-size: 200px;
    color: #e7e7e7;
    z-index: -1;
    line-height: 1;
  }

  .ck-content blockquote.side-quote p {
    font-size: 2em;
    line-height: 1;
  }

  .ck-content blockquote.side-quote p:last-child:not(:first-child) {
    font-size: 1.3em;
    text-align: right;
    color: #555;
  }

  .ck-content span.marker {
    background: yellow;
  }

  .ck-content span.spoiler {
    background: #000;
    color: #000;
  }

  .ck-content span.spoiler:hover {
    background: #000;
    color: #fff;
  }

  .ck-content pre.fancy-code {
    border: 0;
    margin-left: 2em;
    margin-right: 2em;
    border-radius: 10px;
  }

  .ck-content pre.fancy-code::before {
    content: '';
    display: block;
    height: 13px;
    background: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1NCAxMyI+CiAgPGNpcmNsZSBjeD0iNi41IiBjeT0iNi41IiByPSI2LjUiIGZpbGw9IiNGMzZCNUMiLz4KICA8Y2lyY2xlIGN4PSIyNi41IiBjeT0iNi41IiByPSI2LjUiIGZpbGw9IiNGOUJFNEQiLz4KICA8Y2lyY2xlIGN4PSI0Ny41IiBjeT0iNi41IiByPSI2LjUiIGZpbGw9IiM1NkM0NTMiLz4KPC9zdmc+Cg==);
    margin-bottom: 8px;
    background-repeat: no-repeat;
  }

  .ck-content pre.fancy-code-dark {
    background: #272822;
    color: #fff;
    box-shadow: 5px 5px 0 #0000001f;
  }

  .ck-content pre.fancy-code-bright {
    background: #dddfe0;
    color: #000;
    box-shadow: 5px 5px 0 #b3b3b3;
  }
</style>
