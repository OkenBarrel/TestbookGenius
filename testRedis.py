from django.core.cache import cache

# 设置缓存
cache.set('test_key', 'test_value', timeout=60*5)

# 获取缓存
value = cache.get('test_key')
print(value)  # 应该输出 'test_value'
