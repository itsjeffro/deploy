import * as React from 'react';

export default class Dropdown extends React.Component<any, any> {
  private isMouseDown;

  state = {
    isFocused: false,
    isOpened: false,
  };

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.isFocused && this.state.isFocused) {
      this.open();
    }
  }

  handleFocus = () => {
    this.setState({ isFocused: true });
  }

  handleBlur = (event) => {
    const currentTarget = event.currentTarget;

    console.log('mouseDown', this.isMouseDown);
    if (this.isMouseDown) {
      console.log(1);
      return;
    }

    // this.close();

    this.setState({ isFocused: false });
  }

  handleItemClick = (event, item) => {
    const { onChange } = this.props;

    onChange(event, item);

    this.close();
  }

  handleMouseDown = () => {
    this.isMouseDown = true;

    console.log('add', this.isMouseDown);

    document.addEventListener('mouseup', this.handleDocumentMouseUp);
  }

  handleDocumentMouseUp = () => {
    this.isMouseDown = false;

    console.log('remove', this.isMouseDown);

    document.removeEventListener('mouseup', this.handleDocumentMouseUp);
  }

  open = () => {
    this.setState({ isOpened: true });
  }

  close = () => {
    const { isOpened } = this.state;

    if (isOpened) {
      this.setState({ isOpened: false });
    }
  }

  render() {
    const { name,  placeholder,  options } = this.props;
    const { isOpened } = this.state;

    return (
      <div className="dropdown">
        <input
          className="form-control dropdown__input"
          type="text"
          name={ name }
          placeholder={ placeholder }
          onFocus={ this.handleFocus }
          onBlur={ this.handleBlur }
          onMouseDown={ this.handleMouseDown }
        />
        <i aria-hidden="true" className="dropdown__icon">{ '' }</i>
        <div className={ `dropdown__menu${ isOpened ? ' visible' : '' }` }>
          <ul>
            {(options || []).map((option) =>
              <li key={ option.value }>
                <span
                  role="option"
                  onClick={ (event) => this.handleItemClick(event, option) }
                >{ option.label }</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
};

