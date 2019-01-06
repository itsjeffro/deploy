<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Provider;
use Deploy\Http\Requests\AccountRequest;

class AccountController extends Controller
{
    /**
     * Show the account.
     *
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        return view('deploy::account.show', [
            'user' => auth()->user(),
            'providers' => Provider::get(),
        ]);
    }

    /**
     * Update account details of the current user that is logged in.
     *
     * @param  \Deploy\Http\Requests\AccountRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(AccountRequest $request)
    {
        $user = auth()->user();
        $user->fill($request->except(['password']));
        $user->save();

        return redirect('account')->with([
            'message' => 'Successfully updated account details.'
        ]);
    }
}