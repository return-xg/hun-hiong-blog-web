import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Typography,
  Form,
  Input,
  Select,
  Radio,
  Upload,
  Button,
  message,
  Space,
  Spin,
} from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css';

import { getArticleDetail, createArticle, updateArticle } from '@/api/article';
import { getCategoryList } from '@/api/category';
import { getTagList } from '@/api/tag';
import { uploadFile } from '@/api/file';
import type { Category } from '@/types/category';
import type { Tag } from '@/types/tag';
import type { Article } from '@/types/article';
import { ARTICLE_STATUS, ARTICLE_STATUS_MAP, API_BASE_URL } from '@/utils/constants';

const { Title } = Typography;
const { TextArea } = Input;

const ArticleEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 分类和标签下拉数据
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // 封面图相关
  const [coverUrl, setCoverUrl] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  // 富文本编辑器
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const [htmlContent, setHtmlContent] = useState('');
  // 编辑模式下，标记文章内容是否已加载完成
  const [contentReady, setContentReady] = useState(!isEditMode);

  /** 工具栏配置 */
  const toolbarConfig: Partial<IToolbarConfig> = useMemo(() => ({}), []);

  /** 编辑器配置 */
  const editorConfig: Partial<IEditorConfig> = useMemo(() => ({
    placeholder: '请输入文章内容...',
    MENU_CONF: {
      uploadImage: {
        // 自定义上传函数，使用项目统一的上传接口
        async customUpload(file: File, insertFn: (url: string, alt: string, href: string) => void) {
          const res = await uploadFile(file);
          const data = (res as any).data;
          // 后端返回的是相对路径，需要拼接后端基础地址
          const fullUrl = data.url.startsWith('http') ? data.url : `${API_BASE_URL}${data.url}`;
          insertFn(fullUrl, data.originalName, fullUrl);
        },
      },
    },
  }), []);

  /** 编辑器销毁 */
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
        setEditor(null);
      }
    };
  }, [editor]);



  /** 加载分类和标签列表 */
  const fetchOptions = async () => {
    const [catRes, tagRes] = await Promise.all([
      getCategoryList({ current: 1, size: 1000 }),
      getTagList({ current: 1, size: 1000 }),
    ]);
    setCategories((catRes as any).data.records);
    setTags((tagRes as any).data.records);
  };

  /** 编辑模式下加载文章详情 */
  const fetchArticle = async (articleId: string) => {
    setLoading(true);
    try {
      const res = await getArticleDetail(articleId);
      const data = (res as any).data;
      form.setFieldsValue({
        title: data.title,
        categoryId: data.categoryId,
        tagIds: data.tags?.map((tag: Tag) => tag.id) ?? [],
        summary: data.summary,
        status: data.status,
      });
      // 回填富文本内容
      if (data.content) {
        setHtmlContent(data.content);
      }
      setContentReady(true);
      if (data.coverUrl) {
        setCoverUrl(data.coverUrl);
        // 后端返回的是相对路径，需要拼接后端基础地址才能正确渲染图片预览
        const fullCoverUrl = data.coverUrl.startsWith('http') ? data.coverUrl : `${API_BASE_URL}${data.coverUrl}`;
        setFileList([{ uid: '-1', name: 'cover', url: fullCoverUrl, status: 'done' }]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
    if (isEditMode) {
      fetchArticle(id!);
    }
  }, [id]);

  /** 自定义封面图上传 */
  const handleUploadCover = async (options: any) => {
    const { file, onSuccess, onError } = options;
    setUploading(true);
    try {
      const res = await uploadFile(file as File);
      const data = (res as any).data;
      setCoverUrl(data.url);
      onSuccess(data, file);
    } catch (err) {
      onError(err);
      message.error('封面图上传失败');
    } finally {
      setUploading(false);
    }
  };

  /** 封面图变化 */
  const handleCoverChange = (info: any) => {
    const { file, fileList: newFileList } = info;
    setFileList(newFileList.slice(-1));
    if (file.status === 'removed') {
      setCoverUrl('');
    }
  };

  /** 提交表单 */
  const handleSubmit = async () => {
    const values = await form.validateFields();
    setSubmitting(true);
    try {
      // 只组装 ArticleDTO 定义的字段，空值不发送
      const submitData: Record<string, unknown> = {
        title: values.title,
        status: values.status,
        content: htmlContent,
      };
      if (values.categoryId !== undefined && values.categoryId !== null) {
        submitData.categoryId = values.categoryId;
      }
      if (values.tagIds && values.tagIds.length > 0) {
        submitData.tagIds = values.tagIds;
      }
      if (coverUrl) {
        submitData.coverUrl = coverUrl;
      }
      if (values.summary) {
        submitData.summary = values.summary;
      }

      if (isEditMode) {
        await updateArticle(id!, submitData as Partial<Article>);
        message.success('更新成功');
      } else {
        await createArticle(submitData as Partial<Article>);
        message.success('创建成功');
      }
      navigate('/admin/articles');
    } finally {
      setSubmitting(false);
    }
  };

  /** 取消返回 */
  const handleCancel = () => {
    navigate('/admin/articles');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleCancel} style={{ marginRight: 8 }} />
        <Title level={3} style={{ margin: 0 }}>{isEditMode ? '编辑文章' : '新建文章'}</Title>
      </div>

      <Spin spinning={loading}>
        <Form form={form} layout="vertical" style={{ maxWidth: 1000 }}>
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" />
          </Form.Item>

          <Form.Item name="categoryId" label="分类">
            <Select
              placeholder="请选择分类"
              allowClear
              options={categories.map((cat) => ({ label: cat.name, value: cat.id }))}
            />
          </Form.Item>

          <Form.Item name="tagIds" label="标签">
            <Select
              mode="multiple"
              placeholder="请选择标签"
              allowClear
              options={tags.map((tag) => ({ label: tag.name, value: tag.id }))}
            />
          </Form.Item>

          <Form.Item name="summary" label="摘要">
            <TextArea placeholder="请输入文章摘要（选填）" rows={3} />
          </Form.Item>

          <Form.Item label="封面图">
            <Upload
              listType="picture"
              maxCount={1}
              fileList={fileList}
              customRequest={handleUploadCover}
              onChange={handleCoverChange}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />} loading={uploading}>
                上传封面图
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            initialValue={ARTICLE_STATUS.DRAFT}
            rules={[{ required: true, message: '请选择文章状态' }]}
          >
            <Radio.Group>
              <Radio value={ARTICLE_STATUS.DRAFT}>{ARTICLE_STATUS_MAP[ARTICLE_STATUS.DRAFT]}</Radio>
              <Radio value={ARTICLE_STATUS.PUBLISHED}>{ARTICLE_STATUS_MAP[ARTICLE_STATUS.PUBLISHED]}</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="内容" required>
            {contentReady ? (
            <div style={{ border: '1px solid #d9d9d9', borderRadius: 6 }}>
              <Toolbar
                editor={editor}
                defaultConfig={toolbarConfig}
                mode="default"
                style={{ borderBottom: '1px solid #d9d9d9' }}
              />
              <Editor
                defaultConfig={editorConfig}
                value={htmlContent}
                onCreated={setEditor}
                onChange={(editor) => setHtmlContent(editor.getHtml())}
                mode="default"
                style={{ height: 500 }}
              />
            </div>
            ) : null}
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" loading={submitting} onClick={handleSubmit}>
                {isEditMode ? '保存修改' : '创建文章'}
              </Button>
              <Button onClick={handleCancel}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default ArticleEdit;
