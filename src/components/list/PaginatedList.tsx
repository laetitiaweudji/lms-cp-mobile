import { FlatList, Pressable, RefreshControl, Text, View, type ListRenderItem } from "react-native";

type PaginatedListProps<T> = {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T) => string;
  emptyState: React.ReactNode;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

export function PaginatedList<T>({
  data,
  renderItem,
  keyExtractor,
  emptyState,
  isRefreshing,
  onRefresh,
  page = 1,
  totalPages = 1,
  onPageChange,
}: PaginatedListProps<T>) {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      refreshControl={
        onRefresh ? <RefreshControl refreshing={!!isRefreshing} onRefresh={onRefresh} /> : undefined
      }
      ListEmptyComponent={() => <>{emptyState}</>}
      contentContainerClassName="gap-3 pb-4"
      ListFooterComponent={
        totalPages > 1 && onPageChange ? (
          <View className="flex-row items-center justify-center gap-4 py-4">
            <Pressable disabled={page <= 1} onPress={() => onPageChange(page - 1)}>
              <Text
                className={`text-sm font-medium ${
                  page <= 1 ? "text-text-muted" : "text-primary-600"
                }`}
              >
                Previous
              </Text>
            </Pressable>
            <Text className="text-sm text-text-secondary">
              Page {page} of {totalPages}
            </Text>
            <Pressable disabled={page >= totalPages} onPress={() => onPageChange(page + 1)}>
              <Text
                className={`text-sm font-medium ${
                  page >= totalPages ? "text-text-muted" : "text-primary-600"
                }`}
              >
                Next
              </Text>
            </Pressable>
          </View>
        ) : null
      }
    />
  );
}
