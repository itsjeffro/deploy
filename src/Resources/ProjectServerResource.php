<?php

namespace Deploy\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectServerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->server_id,
            'project_server_id' => $this->id,
            'name' => $this->server->name,
            'connect_as' => $this->server->connect_as,
            'ip_address' => $this->server->ip_address,
            'port' => $this->server->port,
            'project_path' => $this->server->project_path,
            'public_key' => $this->server->public_key,
            'connection_status' => $this->server->connection_status,
        ];
    }
}
