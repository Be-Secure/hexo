import warehouse from 'warehouse';

export default ctx => {
  const PostTag = new warehouse.Schema({
    post_id: {type: warehouse.Schema.Types.CUID, ref: 'Post'},
    tag_id: {type: warehouse.Schema.Types.CUID, ref: 'Tag'}
  });

  return PostTag;
};
