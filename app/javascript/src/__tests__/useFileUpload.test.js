import { AttachAvatar } from '../graphql/mutations';
import useFileUpload from '../graphql/useFileUpload';

// TODO: @mdp - more robust testing using fetch and mocks
test('very basic API', () => {
  // eslint-disable-next-line no-unused-expressions
  (function () {
    const { onChange } = useFileUpload({
      updateGQL: AttachAvatar,
      id: '12345abc',
      client: () => {}
    });
    expect(onChange).toBeDefined();
    expect(onChange).toBeInstanceOf(Function);
 });
});
