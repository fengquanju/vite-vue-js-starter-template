class LocalCache {
  // 添加
  setCache(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
  // 查找
  getCache(key) {
    // obj=>sting=>obj
    const value = window.localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
  }
  // 删除
  deleteCache(key) {
    window.localStorage.removeItem(key);
  }
  // 清理
  clearCache() {
    window.localStorage.clear();
  }
}

export default new LocalCache();
