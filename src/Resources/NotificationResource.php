<?php

namespace Deploy\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
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
            'project' => [
                'id' => $this->project->id,
                'name' => $this->project->name,
            ],
            'model_type' => $this->model_type,
            'model_id' => $this->model_id,
            'subject' => $this->subject,
            'reason' => $this->reason,
            'contents' => $this->contents,
            'is_read' => $this->is_read,
            'created_at' => $this->created_at,
        ];
    }
}
