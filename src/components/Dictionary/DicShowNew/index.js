import React, { Component } from 'react';
import { query } from '@/services/dictionary';

export default class DicShowNew extends Component {
  state = {
    name: '',
  };

  componentDidMount() {
    this.fetchName();
  }

  componentDidUpdate(preProps) {
    if (preProps.code !== this.props.code) {
      this.fetchName();
    }
  }

  fetchName = () => {
    const { root, code } = this.props;
    if (!code || code === '') {
      return;
    }

    let v = code;
    if (root && root !== '') {
      v = `${root}$#${v}`;
    }

    const key = `dictionary_${v}`;
    const vv = sessionStorage.getItem(key);
    if (vv && vv !== '') {
      this.setState({ name: vv });
      return;
    }

    query({ q: 'code', code: `${v}` }).then(data => {
      this.setState({ name: data.name });
      sessionStorage.setItem(key, data.name);
    });
  };

  render() {
    const { name } = this.state;
    return <span>{name}</span>;
  }
}
