🌳 md-tree
====

md-tree is a small application that allows you to structure Markdown documents in a tree format.

The document is not shared with others. You can edit it freely. In addition, the application does not send documents or usage to the server without permission.

Document data can be imported / exported as JSON objects. There is no ability to save directly to storage, so reloading the application will erase the data. If you need to save it, manually export and save it.

## ⚠ WARNING

Be careful when importing data received from others. Since this application is under development, it is vulnerable to malicious attacks such as XSS.

## 🤔 To Do

- Editor improvements
- Sorting and moving child documents
- Internationalization
- Exports to file, LocalStorage, and more
- CSS customization
- Extension with Markdown plugin

## 🔧 For Developer

It is provided under the MIT license. The author is Getaji. Feel free to use the fork.

The data structure of md-tree is simple, the node consists of a Markdown string in the body and an array of child nodes. So far, it does not include metadata etc. and can be easily linked with other systems.
