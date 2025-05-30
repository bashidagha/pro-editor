import { Collapse, Divider, Typography } from 'antd';
import { CSSProperties, memo } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { withProvider } from '..';
import { Code } from './CodeBlock';
import { useStyles } from './style';

export interface MarkdownProps {
  children?: string;
  /**
   * @description ClassName
   */
  className?: string;
  onDoubleClick?: () => void;
  style?: CSSProperties;
  rehypePlugins?: any;
  remarkPlugins?: any;
  components?: Components;
}

const MemoHr = memo((props) => (
  <Divider style={{ marginBottom: '1em', marginTop: 0 }} {...props} />
));
const MemoDetails = memo((props) => <Collapse style={{ marginBottom: '1em' }} {...props} />);
const MemoImage = memo((props) => <img {...props} />);
const MemoAlink = memo((props) => <Typography.Link {...props} />);

const Markdown = memo<MarkdownProps>(
  ({
    children,
    className,
    style,
    onDoubleClick,
    rehypePlugins: outRehypePlugins,
    remarkPlugins: outRemarkPlugins,
    components: outComponents,
    ...rest
  }) => {
    const { styles } = useStyles();
    const components: any = {
      details: MemoDetails,
      hr: MemoHr,
      a: MemoAlink,
      img: MemoImage,
      pre: Code,
      ...outComponents,
    };

    const rehypePlugins = [rehypeKatex, ...(outRehypePlugins || [])];
    const remarkPlugins = [
      [remarkGfm, { singleTilde: false }],
      remarkMath,
      ...(outRemarkPlugins || []),
    ];

    return (
      <Typography className={className} onDoubleClick={onDoubleClick} style={style}>
        <ReactMarkdown
          //@ts-ignore
          className={styles.markdown}
          components={components}
          rehypePlugins={rehypePlugins as any}
          remarkPlugins={remarkPlugins as any}
          {...rest}
        >
          {children}
        </ReactMarkdown>
      </Typography>
    );
  },
);

export default withProvider(Markdown) as React.FC<MarkdownProps>;
