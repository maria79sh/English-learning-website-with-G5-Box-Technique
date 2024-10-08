from gateways.mongo import MongoConnection
from gateways.redis import RedisConnection
import settings


mongo_conn = MongoConnection(settings.DATABASE_NAME)
redis_conn = RedisConnection()