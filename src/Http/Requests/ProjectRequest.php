<?php

namespace Deploy\Http\Requests;

use Deploy\Models\Provider;
use Deploy\ProviderOauthManager;
use Deploy\ProviderRepositoryManager;
use Exception;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class ProjectRequest extends FormRequest
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
            'name' => 'required',
            'provider_id' => 'required',
            'repository' => 'required',
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param \Illuminate\Validation\Validator $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->isInvalidRepository()) {
                $validator->errors()->add('repository', 'The repository provided is invalid or could be private.');
            }
        });
    }

    /**
     * Check if the provided repository is valid or not.
     *
     * @return boolean
     */
    public function isInvalidRepository()
    {
        $providerId = $this->request->get('provider_id');
        $repository = $this->request->get('repository');
        $user = auth()->user();
        $provider = Provider::find($providerId);

        $response = [];

        try {
            $providerOauth = new ProviderOauthManager($provider, $user);
            $providerRepository = new ProviderRepositoryManager();
            $diver = $providerRepository->driver($provider->friendly_name, $providerOauth->getAccessToken());
            $response = $diver->repository($repository);
        } catch (Exception $e) {
             Log::info($e->getMessage());
        }

        return empty($response);
    }
}