<?php

namespace Deploy\Http\Requests;

use Deploy\Models\Provider;
use Deploy\ProviderOauth\ProviderOauthFactory;
use Deploy\ProviderOauthManager;
use Deploy\ProviderRepositoryManager;
use Exception;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class ProjectServerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'server_id' => 'required',
            'project_id' => 'required',
            'project_path' => 'required',
        ];
    }
}