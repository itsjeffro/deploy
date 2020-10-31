import * as React from 'react';
import Container from '../../../components/Container';
import Alert from '../../../components/Alert';

const Warnings = (props) => {
  const { warnings } = props;

  if (warnings.length === 0) {
    return <></>;
  }

  return (
    <Container fluid>
      <Alert type="warning">
        <p>The following warnings have occurred:</p>

        <ul>
          {warnings.map(warning =>
            <li key={ warning.code }>{ warning.message }</li>
          )}
        </ul>
      </Alert>
    </Container>
  )
}

export default Warnings;
