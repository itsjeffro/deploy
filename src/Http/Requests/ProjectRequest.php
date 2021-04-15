<?php

namespace Deploy\Http\Requests;

use Deploy\Models\Project;
use Deploy\Models\Provider;
use Deploy\ProviderOauth\ProviderOauthFactory;
use Deploy\ProviderOauthManager;
use Deploy\ProviderRepositoryManager;
use Exception;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class ProjectRequest extends FormRequest
{
    /** @var ProviderOauthManager */
    private $providerOauthManager;

    /**
     * @param ProviderOauthManager $providerOauthManager
     */
    public function __construct(ProviderOauthManager $providerOauthManager) {
        $this->providerOauthManager = $providerOauthManager;
    }

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
            'name' => [
                'required',
                'max:255',
            ],
            'provider_id' => [
                'required',
            ],
            'repository' => [
                'required',
                'max:255',
            ],
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

            if ($this->hasReachedProjectLimit()) {
                $validator->errors()->add('id', 'You have reached your project limit.');
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

        $provider = Provider::find($providerId);

        if (!$provider instanceof Provider) {
            return false;
        }

        $response = [];

        try {
            $providerOauth = ProviderOauthFactory::create($provider->friendly_name);

            $user = auth()->user();

            $providerOauthManager = $this->providerOauthManager
                ->setProvider($providerOauth)
                ->setUser($user);

            $providerRepository = new ProviderRepositoryManager();

            $diver = $providerRepository->driver($provider->friendly_name, $providerOauthManager->getAccessToken());

            $response = $diver->repository($repository);
        } catch (Exception $e) {
             Log::info($e->getMessage());
        }

        return empty($response);
    }

    /**
     * Determines if the user has reached their project limit.
     */
    protected function hasReachedProjectLimit(): bool
    {
        $user = auth()->user();

        if (!method_exists($user, 'projectLimit') || is_null($user->projectLimit())) {
            return false;
        }

        $projectCount = Project::where('user_id', $user->id)->count();

        return $projectCount >= $user->projectLimit();
    }
}
