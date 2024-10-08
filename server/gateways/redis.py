import redis
import json
import time
import settings


class RedisConnection:

    def get_exp_key(self, key): 
        if key in settings.EXP_DOC.keys():
            return settings.EXP_DOC[key]
        return settings.EXP_DOC['daily']
    

    def __init__(self):
        self.redis = redis.StrictRedis(host='localhost', port=6379, db=0)


    def set_word_with_expire(self, key, username, word):
        self.redis.zadd(f"{username}:{key}", {word: time.time() + settings.EXP_DOC[key]})


    def get_words(self, key, username):
        current_time = time.time()
        self.move_expire_word(username, current_time)
        words = self.redis.zrange(f"{username}:{key}", 0, -1)
        if len(words) == 0:
            for word in settings.STATIC_WORD_BOX:
                self.set_word_with_expire(1, username, word)
            return settings.STATIC_WORD_BOX
        return words
    
    
    def move_expire_word(self, username, current_time):
        for k,v in settings.EXP_DOC.items():
                    # Retrieve words that have expired
            expired_words = self.redis.zrangebyscore(f"{username}:{k}", "-inf", current_time)
            if expired_words:
                self.redis.zremrangebyscore(f"{username}:{k}", "-inf", current_time)
                if k > 1:
                    for word in expired_words:
                        self.set_word_with_expire(1, username, word)


    def move_word_up(self, key, username, word):
        if key < len(settings.EXP_DOC):
           key_des = key + 1
           words = self.redis.zrange(f"{username}:{key}", 0, -1)
           for w in words:
               if w.decode("utf-8") == word:
                   self.redis.zrem(f"{username}:{key}", word)
                   self.redis.zadd(f"{username}:{key_des}", {word: time.time() + settings.EXP_DOC[key_des]})


    def move_word_down(self, key, username, word):
        words = self.redis.zrange(f"{username}:{key}", 0, -1)
        for w in words:
            if w.decode("utf-8") == word:
                  # Remove the word from the current set and add it to the first set with updated expiration time
                self.redis.zrem(f"{username}:{key}", word)
                self.redis.zadd(f"{username}:1", {word: time.time() + settings.EXP_DOC[1]})
