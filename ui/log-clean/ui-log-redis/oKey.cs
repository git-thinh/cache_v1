using System;
using System.Collections.Generic;
using System.Text;
using TeamDevRedis;

namespace ui_log_redis
{
    public class oKey
    {
        public string key_full { set; get; }
        public string key0 { set; get; }
        public string key1 { set; get; }
        public string key2 { set; get; }
        public string key3 { set; get; }

        public string[] keys_last { set; get; }

        public oKey(RedisDataAccessProvider redis, string s) {
            string[] a = s.Split(new char[] { '#', '.' });

            this.key_full = s;            
            this.key0 = a[0];
            if (a.Length > 1) this.key1 = a[1];
            if (a.Length > 2) this.key2 = a[2];
            if (a.Length > 3) this.key3 = a[3];
            try
            {
                this.keys_last = redis.ReadMultiString(redis.SendCommand(RedisCommand.HKEYS, s));
            }
            catch (Exception e) { 
            
            }
        }

        public override string ToString()
        {
            return string.Format("{0}: {1}", this.key_full, string.Join(", ", this.keys_last));
        }
    }
}
