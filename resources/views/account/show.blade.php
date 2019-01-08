@extends('layouts.app')

@section('content')
    <div class="breadcrumbs">
        <div class="container">
            <div class="pull-left">
                <span class="heading">
                    My Account
                </span>
            </div>
        </div>
    </div>

    <div class="container content">
        @if (session('message'))
        <div class="alert alert-success alert-dismissible">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            {{session('message')}}
        </div>
        @endif

        <div class="panel panel-default">
            <div class="panel-heading">Account</div>
            <div class="panel-body">
                <form method="POST" action="{{ url('account') }}">
                    <input type="hidden" name="_method" value="PUT">
                    {{ csrf_field() }}

                    <div class="row">
                        <div class="form-group col-xs-12">
                            <label for="name">Name</label>
                            <input class="form-control" name="name" type="text" id="name" value="{{$user->name}}">
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-xs-12">
                            <label for="email">Email</label>
                            <input class="form-control" name="email" type="text" id="email" value="{{$user->email}}">
                        </div>
                    </div>
                    <button class="btn btn-primary" type="submit" name="submit">Save</button>
                </form>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">Change password</div>
            <div class="panel-body">
                <form method="POST" action="{{ route('account-password.update') }}">
                    <input type="hidden" name="_method" value="PUT">
                    {{ csrf_field() }}

                    <div class="row{{ $errors->has('new_password') ? ' has-error' : '' }}">
                        <div class="form-group col-xs-12">
                            <label for="new_password">New password</label>
                            <input class="form-control" name="new_password" type="password" id="new_password" value="">
                            @if ($errors->has('new_password'))
                                <span class="help-block">
                                    <strong>{{ $errors->first('new_password') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>
                    <div class="row{{ $errors->has('confirm_password') ? ' has-error' : '' }}">
                        <div class="form-group col-xs-12">
                            <label for="confirm_password">Confirm password</label>
                            <input class="form-control" name="confirm_password" type="password" id="confirm_password" value="">
                            @if ($errors->has('confirm_password'))
                                <span class="help-block">
                                    <strong>{{ $errors->first('confirm_password') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>
                    <button class="btn btn-primary" type="submit" name="submit">Update password</button>
                </form>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">Integrations</div>
            <div class="panel-body">
                @foreach($providers as $provider)
                    <a class="btn btn-primary"
                        href="{{ route('provider-authorize.get', ['provider' => $provider->friendly_name]) }}"
                        title="Integrate with {{ $provider->name }}"
                    ><i class="fa fa-{{ $provider->friendly_name }}"></i> {{ $provider->name }}</a>
                @endforeach
            </div>
        </div>
    </div>
@endsection
