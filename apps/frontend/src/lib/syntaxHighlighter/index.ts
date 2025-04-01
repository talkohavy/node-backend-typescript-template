import hljs from 'highlight.js';
import { typescriptLanguageToRegister } from './languages/typescript';
import { javascriptLanguageToRegister } from './languages/javascript';
import './styles/vscode-dark.css';
import './styles/1c-light.css';

hljs.registerLanguage('javascript', javascriptLanguageToRegister);
hljs.registerLanguage('typescript', typescriptLanguageToRegister);
