import * as constant from "../serversConstants";

export const updateServerConnection = (serverId: number, connectionStatus: number): object =>({
  type: constant.UPDATE_SERVER_CONNECTION,
  serverId: serverId,
  connectionStatus: connectionStatus,
});
