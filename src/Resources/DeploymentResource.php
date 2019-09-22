<?php

namespace Deploy\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DeploymentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'committer' => $this->committer,
            'committer_avatar' => $this->committer_avatar,
            'repository' => $this->repository,
            'reference' => $this->reference,
            'branch' => $this->branch,
            'commit' => $this->commit,
            'commit_url' => $this->commit_url,
            'status' => $this->status,
            'raw_output' => $this->raw_output,
            'started_at' => $this->started_at->format('Y-m-d H:i:s'),
            'duration' => $this->duration,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
