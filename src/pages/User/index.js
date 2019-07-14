import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import {
  Container,
  Header,
  Name,
  Bio,
  Avatar,
  Stars,
  OwnerAvatar,
  Starred,
  Info,
  Title,
  Author,
  Loading,
} from './styles';
import api from '../../services/api';

class User extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  state = {
    stars: [],
    loading: false,
    page: 1,
  };

  componentDidMount() {
    this.loadList();
  }

  componentDidUpdate(_, prevState) {
    const { page } = this.state;

    if (prevState.page !== page) {
      this.loadList();
    }
  }

  loadList = () => {
    const { navigation } = this.props;

    const { page } = this.state;

    const user = navigation.getParam('user');

    this.setState({
      loading: true,
    });

    api
      .get(`/users/${user.login}/starred?page=${page}`)
      .then(response => {
        if (response.status === 200) {
          this.setState(prevState => ({
            stars: [...prevState.stars, ...response.data],
          }));
        }
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  loadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  refreshList = () => {
    this.setState({
      page: 1,
    });
  };

  handleNavigate = repository => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { repository });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <Loading>
            <ActivityIndicator color="#7159c1" />
          </Loading>
        ) : (
          <Stars
            onRefresh={this.refreshList}
            refreshing={loading}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleNavigate(item)}>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}

export default User;
