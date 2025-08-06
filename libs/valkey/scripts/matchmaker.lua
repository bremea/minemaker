-- KEYS[1] = matchmaking:{gameid}:{region}:instances
-- ARGV[1] = player UUID
local player = ARGV[1]

local instances = KEYS[1]
local total = server.call("ZCARD", instances)

for i = 0, total - 1 do
    local id = server.call("ZREVRANGE", instances, i, i)[1]
    local propertiesKey = "instances:" .. id
    local onlineKey = propertiesKey .. ":online"
    local standbyKey = propertiesKey .. ":standby"

    local status = server.call("HGET", propertiesKey, "status")

    if status == "STOPPING" then
        server.call("ZREM", instances, id)
    else
        local onlineCount = server.call("SCARD", onlineKey)
        local standbyCount = server.call("SCARD", standbyKey)
        local maxPlayers = tonumber(server.call("HGET", propertiesKey, "max"))

        if onlineCount + standbyCount < maxPlayers then
            local putInStandby = standby
            if status == "STARTING" then
                putInStandby = true
            end

            server.call("SADD", standbyKey, player)

            if onlineCount + standbyCount + 1 >= maxPlayers then
                server.call("ZREM", instances, id)
            end

            return id
        end
    end
end

return nil
