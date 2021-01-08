import '../bootstrap';
import BaseApi from './Api/BaseApi';

class ProjectFolder extends BaseApi {
  /**
   * List project's linked folders.
   */
  list(project_id) {
    return this.getRequest(`/api/projects/${project_id}/folders`);
  }

  /**
   * Deletes one project folder.
   */
  delete(project_id, folder_id) {
    return this.deleteRequest(`/api/projects/${project_id}/folders/${folder_id}`);
  }

  /**
   * Creates one project folder.
   */
  create(project_id, data) {
    return this.postRequest(`/api/projects/${project_id}/folders`, data);
  }
}

export default ProjectFolder;
