import { extname, join } from 'path';
import { exists, listDir, readFile, unlink, writeFile } from 'hexo-fs';

class Scaffold {
  public context: any;
  public scaffoldDir: any;
  public defaults: any;

  constructor(context) {
    this.context = context;
    this.scaffoldDir = context.scaffold_dir;
    this.defaults = {
      normal: [
        '---',
        'layout: {{ layout }}',
        'title: {{ title }}',
        'date: {{ date }}',
        'tags:',
        '---'
      ].join('\n')
    };
  }

  _listDir() {
    const { scaffoldDir } = this;

    return exists(scaffoldDir).then(exist => {
      if (!exist) return [];

      return listDir(scaffoldDir, {
        ignorePattern: /^_|\/_/
      });
    }).map(item => ({
      name: item.substring(0, item.length - extname(item).length),
      path: join(scaffoldDir, item)
    }));
  }

  _getScaffold(name) {
    return this._listDir().then(list => list.find(item => item.name === name));
  }

  get(name, callback) {
    return this._getScaffold(name).then(item => {
      if (item) {
        return readFile(item.path);
      }

      return this.defaults[name];
    }).asCallback(callback);
  }

  set(name, content, callback) {
    const { scaffoldDir } = this;

    return this._getScaffold(name).then(item => {
      let path = item ? item.path : join(scaffoldDir, name);
      if (!extname(path)) path += '.md';

      return writeFile(path, content);
    }).asCallback(callback);
  }

  remove(name, callback) {
    return this._getScaffold(name).then(item => {
      if (!item) return;

      return unlink(item.path);
    }).asCallback(callback);
  }
}

export = Scaffold;
