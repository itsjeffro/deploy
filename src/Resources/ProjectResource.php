<?php

namespace Deploy\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
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
            'id' => $this->id,
            'user_id' => $this->user_id,
            'key' => $this->key,
            'name' => $this->name,
            'provider_id' => $this->provider_id,
            'repository' => $this->repository,
            'branch' => $this->branch,
            'releases' => $this->releases,
            'deploy_on_push' => $this->deploy_on_push,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            'environment_servers' => $this->environmentServers,
            'user' => $this->user,
            'servers' => $this->servers,
            'folders' => $this->folders,
            'last_deployment' => $this->lastDeployment,
            'provider' => $this->provider,
        ];
    }
}
