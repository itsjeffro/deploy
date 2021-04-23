<?php

namespace Deploy\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HookOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'hooks' => [
                'array'
            ],
            'hooks.*.position' => [
                'numeric',
                'required'
            ],
            'hooks.*.order' => [
                'numeric',
                'required'
            ],
        ];
    }
}
