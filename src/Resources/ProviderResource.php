<?php

namespace Deploy\Resources;

use Deploy\Models\DeployAccessToken;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProviderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * 
     * @param Request $request
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'friendly_name' => $this->friendly_name,
            'url' => $this->url,
            'is_connected' => $this->deployAccessToken instanceof DeployAccessToken,
        ];
    }
}
