import * as React from 'react';
import { Link } from 'react-router-dom';
import Container from '../../components/Container';
import Layout from '../../components/Layout';

class NotFoundPage extends React.Component<any, any> {
  render() {
    return (
      <Layout>
        <div className="content">
          <Container fluid>
            <h2>Page not found!</h2>

            <p>We couldn't find what you were looking for.</p>

            <p>Suggestions</p>

            <ul>
              <li><Link to="/">Create a new project</Link></li>
            </ul>
          </Container>
        </div>
      </Layout>
    )
  }
}

export default NotFoundPage;
