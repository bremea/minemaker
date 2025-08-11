-- KEYS[1] = set to remove from
-- KEYS[2] = set to move to
-- ARGV[1] = value
local from = KEYS[1]
local to = KEYS[2]
local value = ARGV[1]

server.call("SREM", from, value)
server.call("SADD", to, value)
